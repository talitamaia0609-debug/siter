import { 
  type Member, 
  type InsertMember,
  type Event,
  type InsertEvent,
  type MarketplaceItem,
  type PointTransfer,
  type Activity,
  type BotConfig,
  type EventParticipation,
  type ItemDrop,
  type InsertItemDrop,
  type User,
  type InsertUser
} from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for guild management
export interface IStorage {
  // Members
  getMember(id: string): Promise<Member | undefined>;
  getMemberByDiscordId(discordId: string): Promise<Member | undefined>;
  getAllMembers(): Promise<Member[]>;
  createMember(member: InsertMember): Promise<Member>;
  
  // Events
  getEvent(id: string): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  getActiveEvents(): Promise<Event[]>;
  startEvent(eventId: string, startedBy: string): Promise<void>;
  endEventAndAwardPoints(eventId: string): Promise<number>;
  
  // Event Participations
  checkIn(eventId: string, memberId: string): Promise<void>;
  hasCheckedIn(eventId: string, memberId: string): Promise<boolean>;
  
  // Activities
  getRecentActivities(limit?: number): Promise<Activity[]>;
  
  // Marketplace
  getMarketplaceItems(): Promise<MarketplaceItem[]>;
  
  // Transfers
  getPointTransfers(): Promise<PointTransfer[]>;
  
  // Bot Config
  getBotConfig(guildId: string): Promise<BotConfig | undefined>;
  setEventManagerRole(guildId: string, roleId: string): Promise<void>;
  
  // Item Drops
  getItemDrops(): Promise<ItemDrop[]>;
  createItemDrop(drop: InsertItemDrop): Promise<ItemDrop>;
  
  // Users (for authentication)
  getUser(id: string): Promise<User | undefined>;
  getUserByDiscordId(discordId: string): Promise<User | undefined>;
  createOrUpdateUser(userData: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private members: Map<string, Member>;
  private events: Map<string, Event>;
  private activities: Map<string, Activity>;
  private marketplaceItems: Map<string, MarketplaceItem>;
  private pointTransfers: Map<string, PointTransfer>;
  private botConfigs: Map<string, BotConfig>;
  private eventParticipations: Map<string, EventParticipation>;
  private itemDrops: Map<string, ItemDrop>;
  private users: Map<string, User>;

  constructor() {
    this.members = new Map();
    this.events = new Map();
    this.activities = new Map();
    this.marketplaceItems = new Map();
    this.pointTransfers = new Map();
    this.botConfigs = new Map();
    this.eventParticipations = new Map();
    this.itemDrops = new Map();
    this.users = new Map();
    
    // Initialize with predefined events
    this.initializeEvents();
  }
  
  private initializeEvents() {
    const predefinedEvents = [
      { id: randomUUID(), name: 'Doações', points: 1, emoji: '💰', isActive: false, startedAt: null, endedAt: null, startedBy: null },
      { id: randomUUID(), name: 'Boss Briare', points: 2, emoji: '🐉', isActive: false, startedAt: null, endedAt: null, startedBy: null },
      { id: randomUUID(), name: 'Boss Lythea', points: 4, emoji: '🐉', isActive: false, startedAt: null, endedAt: null, startedBy: null },
      { id: randomUUID(), name: 'Boss Ostiar', points: 6, emoji: '🐉', isActive: false, startedAt: null, endedAt: null, startedBy: null },
      { id: randomUUID(), name: 'Boss Leo', points: 6, emoji: '🦁', isActive: false, startedAt: null, endedAt: null, startedBy: null },
      { id: randomUUID(), name: 'Boss da Guilda', points: 10, emoji: '🛡️', isActive: false, startedAt: null, endedAt: null, startedBy: null },
      { id: randomUUID(), name: 'Guerra de Território', points: 100, emoji: '⚔️', isActive: false, startedAt: null, endedAt: null, startedBy: null },
      { id: randomUUID(), name: 'Guerra de Cerco', points: 150, emoji: '🏰', isActive: false, startedAt: null, endedAt: null, startedBy: null },
      { id: randomUUID(), name: 'Boss Aranamed', points: 8, emoji: '🐍', isActive: false, startedAt: null, endedAt: null, startedBy: null },
      { id: randomUUID(), name: 'Boss Monarca', points: 10, emoji: '👑', isActive: false, startedAt: null, endedAt: null, startedBy: null },
    ];
    
    predefinedEvents.forEach(event => {
      this.events.set(event.id, event as Event);
    });
  }

  async getMember(id: string): Promise<Member | undefined> {
    return this.members.get(id);
  }

  async getMemberByDiscordId(discordId: string): Promise<Member | undefined> {
    return Array.from(this.members.values()).find(
      (member) => member.discordId === discordId,
    );
  }

  async getAllMembers(): Promise<Member[]> {
    return Array.from(this.members.values());
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const id = randomUUID();
    const member: Member = { 
      id,
      discordId: insertMember.discordId,
      name: insertMember.name,
      class: insertMember.class,
      level: insertMember.level ?? 1,
      power: insertMember.power ?? 0,
      eventPoints: insertMember.eventPoints ?? 0,
      createdAt: new Date()
    };
    this.members.set(id, member);
    return member;
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getActiveEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.isActive);
  }

  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    const activities = Array.from(this.activities.values());
    return activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getMarketplaceItems(): Promise<MarketplaceItem[]> {
    return Array.from(this.marketplaceItems.values());
  }


  async getPointTransfers(): Promise<PointTransfer[]> {
    return Array.from(this.pointTransfers.values());
  }
  
  async startEvent(eventId: string, startedBy: string): Promise<void> {
    const event = this.events.get(eventId);
    if (event) {
      event.isActive = true;
      event.startedAt = new Date();
      event.startedBy = startedBy;
      this.events.set(eventId, event);
    }
  }
  
  async endEventAndAwardPoints(eventId: string): Promise<number> {
    const event = this.events.get(eventId);
    if (!event) return 0;
    
    // Get all participations for this event
    const participations = Array.from(this.eventParticipations.values())
      .filter(p => p.eventId === eventId);
    
    // Award points to each participant
    for (const participation of participations) {
      const member = this.members.get(participation.memberId);
      if (member) {
        member.eventPoints += event.points;
        this.members.set(member.id, member);
      }
    }
    
    // End event
    event.isActive = false;
    event.endedAt = new Date();
    this.events.set(eventId, event);
    
    return participations.length;
  }
  
  async checkIn(eventId: string, memberId: string): Promise<void> {
    const id = randomUUID();
    const participation: EventParticipation = {
      id,
      eventId,
      memberId,
      checkedInAt: new Date()
    };
    this.eventParticipations.set(id, participation);
  }
  
  async hasCheckedIn(eventId: string, memberId: string): Promise<boolean> {
    return Array.from(this.eventParticipations.values())
      .some(p => p.eventId === eventId && p.memberId === memberId);
  }
  
  async getBotConfig(guildId: string): Promise<BotConfig | undefined> {
    return Array.from(this.botConfigs.values())
      .find(config => config.guildId === guildId);
  }
  
  async setEventManagerRole(guildId: string, roleId: string): Promise<void> {
    let config = await this.getBotConfig(guildId);
    
    if (config) {
      config.eventManagerRoleId = roleId;
      config.updatedAt = new Date();
      this.botConfigs.set(config.id, config);
    } else {
      const id = randomUUID();
      config = {
        id,
        guildId,
        eventManagerRoleId: roleId,
        updatedAt: new Date()
      };
      this.botConfigs.set(id, config);
    }
  }
  
  async getItemDrops(): Promise<ItemDrop[]> {
    return Array.from(this.itemDrops.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createItemDrop(insertDrop: InsertItemDrop): Promise<ItemDrop> {
    const id = randomUUID();
    const drop: ItemDrop = {
      id,
      ...insertDrop,
      createdAt: new Date()
    };
    this.itemDrops.set(id, drop);
    return drop;
  }
  
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByDiscordId(discordId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.discordId === discordId
    );
  }
  
  async createOrUpdateUser(userData: InsertUser): Promise<User> {
    const existingUser = await this.getUserByDiscordId(userData.discordId);
    
    if (existingUser) {
      const updatedUser: User = {
        ...existingUser,
        username: userData.username,
        discriminator: userData.discriminator ?? null,
        email: userData.email ?? null,
        avatar: userData.avatar ?? null,
        accessToken: userData.accessToken ?? null,
        refreshToken: userData.refreshToken ?? null,
        updatedAt: new Date()
      };
      this.users.set(existingUser.id, updatedUser);
      return updatedUser;
    } else {
      const id = randomUUID();
      const newUser: User = {
        id,
        discordId: userData.discordId,
        username: userData.username,
        discriminator: userData.discriminator ?? null,
        email: userData.email ?? null,
        avatar: userData.avatar ?? null,
        accessToken: userData.accessToken ?? null,
        refreshToken: userData.refreshToken ?? null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(id, newUser);
      return newUser;
    }
  }
}

export const storage = new MemStorage();
