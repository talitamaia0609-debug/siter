import { 
  Client, 
  GatewayIntentBits, 
  SlashCommandBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  REST,
  Routes,
  ChatInputCommandInteraction,
  ButtonInteraction,
  StringSelectMenuInteraction,
  PermissionFlagsBits,
  ChannelType
} from 'discord.js';
import { storage } from './storage';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ]
});

// Store active events and configurations in memory
const activeEventMessages = new Map<string, { messageId: string; channelId: string; eventId: string }>();

export async function startBot() {
  const token = process.env.DISCORD_BOT_TOKEN;
  
  if (!token) {
    console.log('⚠️ DISCORD_BOT_TOKEN não configurado. Bot Discord não será iniciado.');
    return;
  }

  client.once('ready', async () => {
    console.log(`🤖 Bot Discord conectado como ${client.user?.tag}`);
    
    // Register slash commands
    await registerCommands();
  });

  client.on('interactionCreate', async (interaction) => {
    try {
      if (interaction.isChatInputCommand()) {
        await handleCommand(interaction);
      } else if (interaction.isButton()) {
        await handleButton(interaction);
      } else if (interaction.isStringSelectMenu()) {
        await handleSelectMenu(interaction);
      }
    } catch (error) {
      console.error('Erro ao processar interação:', error);
      const errorMessage = 'Ocorreu um erro ao processar sua solicitação.';
      
      if ('replied' in interaction && 'deferred' in interaction) {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
          await interaction.reply({ content: errorMessage, ephemeral: true });
        }
      }
    }
  });

  await client.login(token);
  return client;
}

async function registerCommands() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token || !client.user) return;

  const commands = [
    new SlashCommandBuilder()
      .setName('configurar')
      .setDescription('Configura o cargo que pode gerenciar eventos')
      .addRoleOption(option =>
        option.setName('cargo')
          .setDescription('Cargo que poderá iniciar e encerrar eventos')
          .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    new SlashCommandBuilder()
      .setName('evento')
      .setDescription('Inicia um evento da guilda'),
    
    new SlashCommandBuilder()
      .setName('drop')
      .setDescription('Registra um drop de item de um evento')
      .addStringOption(option =>
        option.setName('item')
          .setDescription('Nome do item dropado')
          .setRequired(true)
      )
      .addIntegerOption(option =>
        option.setName('diamantes')
          .setDescription('Valor em diamantes do item')
          .setRequired(true)
      )
      .addStringOption(option =>
        option.setName('evento')
          .setDescription('Nome do evento')
          .setRequired(true)
      )
      .addStringOption(option =>
        option.setName('participantes')
          .setDescription('Lista de participantes (separados por vírgula)')
          .setRequired(true)
      )
  ].map(command => command.toJSON());

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log('🔄 Registrando comandos slash...');
    
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );

    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
  }
}

async function handleCommand(interaction: ChatInputCommandInteraction) {
  if (!interaction.guildId) {
    await interaction.reply({ content: 'Este comando só pode ser usado em um servidor.', ephemeral: true });
    return;
  }

  switch (interaction.commandName) {
    case 'configurar':
      await handleConfigCommand(interaction);
      break;
    case 'evento':
      await handleEventCommand(interaction);
      break;
    case 'drop':
      await handleDropCommand(interaction);
      break;
  }
}

async function handleConfigCommand(interaction: ChatInputCommandInteraction) {
  const role = interaction.options.getRole('cargo', true);
  const guildId = interaction.guildId!;

  // Save configuration to storage
  await storage.setEventManagerRole(guildId, role.id);

  await interaction.reply({
    content: `✅ Configuração atualizada! O cargo ${role} agora pode gerenciar eventos.`,
    ephemeral: true
  });
}

async function handleEventCommand(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId!;
  const member = interaction.member;

  // Check if user has permission
  const config = await storage.getBotConfig(guildId);
  if (!config?.eventManagerRoleId) {
    await interaction.reply({
      content: '⚠️ O cargo de gerente de eventos ainda não foi configurado. Use /configurar primeiro.',
      ephemeral: true
    });
    return;
  }

  const hasRole = member && 'roles' in member && typeof member.roles !== 'string' && 'cache' in member.roles && member.roles.cache.has(config.eventManagerRoleId);
  if (!hasRole) {
    await interaction.reply({
      content: '❌ Você não tem permissão para iniciar eventos.',
      ephemeral: true
    });
    return;
  }

  // Get all events
  const events = await storage.getAllEvents();
  const inactiveEvents = events.filter(e => !e.isActive);

  if (inactiveEvents.length === 0) {
    await interaction.reply({
      content: '⚠️ Não há eventos disponíveis para iniciar.',
      ephemeral: true
    });
    return;
  }

  // Create select menu with events
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('select_event')
    .setPlaceholder('Escolha um evento para iniciar')
    .addOptions(
      inactiveEvents.map(event =>
        new StringSelectMenuOptionBuilder()
          .setLabel(event.name)
          .setDescription(`${event.points} pontos`)
          .setValue(event.id)
          .setEmoji(event.emoji)
      )
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  await interaction.reply({
    content: '📋 Selecione qual evento deseja iniciar:',
    components: [row],
    ephemeral: true
  });
}

async function handleSelectMenu(interaction: StringSelectMenuInteraction) {
  if (interaction.customId === 'select_event') {
    const eventId = interaction.values[0];
    const event = await storage.getEvent(eventId);

    if (!event) {
      await interaction.reply({ content: '❌ Evento não encontrado.', ephemeral: true });
      return;
    }

    // Start event
    await storage.startEvent(eventId, interaction.user.tag);

    // Create check-in button
    const checkinButton = new ButtonBuilder()
      .setCustomId(`checkin_${eventId}`)
      .setLabel('✅ CHECK-IN EVENTO')
      .setStyle(ButtonStyle.Success);

    const endButton = new ButtonBuilder()
      .setCustomId(`end_event_${eventId}`)
      .setLabel('🛑 ENCERRAR EVENTO')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(checkinButton, endButton);

    // Send message to channel
    const channel = interaction.channel;
    if (!channel || channel.type !== ChannelType.GuildText) {
      await interaction.reply({ content: '❌ Não foi possível enviar a mensagem.', ephemeral: true });
      return;
    }

    const message = await channel.send({
      content: `🎉 **${event.name}** ${event.emoji}\n\n📌 Evento iniciado por ${interaction.user}\n💎 Pontos: **${event.points}**\n\n👥 Faça check-in para participar!`,
      components: [row]
    });

    // Store message info
    activeEventMessages.set(eventId, {
      messageId: message.id,
      channelId: channel.id,
      eventId: eventId
    });

    await interaction.reply({
      content: `✅ Evento **${event.name}** iniciado com sucesso!`,
      ephemeral: true
    });
  }
}

async function handleButton(interaction: ButtonInteraction) {
  const [action, eventId] = interaction.customId.split('_').slice(0, 2);
  const fullEventId = interaction.customId.split('_').slice(1).join('_');

  if (action === 'checkin') {
    await handleCheckin(interaction, fullEventId);
  } else if (action === 'end') {
    await handleEndEvent(interaction, fullEventId);
  }
}

async function handleCheckin(interaction: ButtonInteraction, eventId: string) {
  const userId = interaction.user.id;
  const userName = interaction.user.tag;

  // Check if user is already a member
  let member = await storage.getMemberByDiscordId(userId);

  if (!member) {
    // Create new member
    member = await storage.createMember({
      discordId: userId,
      name: userName,
      class: 'Aventureiro',
      level: 1,
      power: 0,
      eventPoints: 0
    });
  }

  // Check if already checked in
  const hasCheckedIn = await storage.hasCheckedIn(eventId, member.id);

  if (hasCheckedIn) {
    await interaction.reply({
      content: '⚠️ Você já fez check-in neste evento!',
      ephemeral: true
    });
    return;
  }

  // Register check-in
  await storage.checkIn(eventId, member.id);

  await interaction.reply({
    content: `✅ Check-in realizado com sucesso! Boa sorte no evento!`,
    ephemeral: true
  });
}

async function handleEndEvent(interaction: ButtonInteraction, eventId: string) {
  const guildId = interaction.guildId!;
  const member = interaction.member;

  // Check permission
  const config = await storage.getBotConfig(guildId);
  if (!config?.eventManagerRoleId) {
    await interaction.reply({
      content: '❌ Configuração não encontrada.',
      ephemeral: true
    });
    return;
  }

  const hasRole = member && 'roles' in member && typeof member.roles !== 'string' && 'cache' in member.roles && member.roles.cache.has(config.eventManagerRoleId);
  if (!hasRole) {
    await interaction.reply({
      content: '❌ Você não tem permissão para encerrar eventos.',
      ephemeral: true
    });
    return;
  }

  // End event and award points
  const event = await storage.getEvent(eventId);
  if (!event) {
    await interaction.reply({ content: '❌ Evento não encontrado.', ephemeral: true });
    return;
  }

  const participantCount = await storage.endEventAndAwardPoints(eventId);

  // Remove buttons from message
  const eventMessage = activeEventMessages.get(eventId);
  if (eventMessage) {
    try {
      const channel = await client.channels.fetch(eventMessage.channelId);
      if (channel && channel.isTextBased()) {
        const message = await channel.messages.fetch(eventMessage.messageId);
        await message.edit({ components: [] });
      }
    } catch (error) {
      console.error('Erro ao editar mensagem:', error);
    }
    activeEventMessages.delete(eventId);
  }

  await interaction.reply({
    content: `🏁 Evento **${event.name}** encerrado!\n👥 **${participantCount}** participantes receberam **${event.points}** pontos cada.`,
    ephemeral: false
  });
}

async function handleDropCommand(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId!;
  const member = interaction.member;

  // Check permission
  const config = await storage.getBotConfig(guildId);
  if (!config?.eventManagerRoleId) {
    await interaction.reply({
      content: '⚠️ O cargo de gerente de eventos ainda não foi configurado.',
      ephemeral: true
    });
    return;
  }

  const hasRole = member && 'roles' in member && typeof member.roles !== 'string' && 'cache' in member.roles && member.roles.cache.has(config.eventManagerRoleId);
  if (!hasRole) {
    await interaction.reply({
      content: '❌ Você não tem permissão para registrar drops.',
      ephemeral: true
    });
    return;
  }

  const itemName = interaction.options.getString('item', true);
  const diamondValue = interaction.options.getInteger('diamantes', true);
  const eventName = interaction.options.getString('evento', true);
  const participants = interaction.options.getString('participantes', true);

  // Find event by name
  const events = await storage.getAllEvents();
  const event = events.find(e => e.name.toLowerCase() === eventName.toLowerCase());

  if (!event) {
    await interaction.reply({
      content: `❌ Evento "${eventName}" não encontrado.`,
      ephemeral: true
    });
    return;
  }

  // Create item drop
  await storage.createItemDrop({
    itemName,
    diamondValue,
    eventId: event.id,
    eventName: event.name,
    participants,
    addedBy: interaction.user.tag
  });

  await interaction.reply({
    content: `✅ Drop registrado com sucesso!\n\n💎 **${itemName}**\n💰 Valor: ${diamondValue} diamantes\n🎯 Evento: ${eventName}\n👥 Participantes: ${participants}`,
    ephemeral: false
  });
}

export { client };
