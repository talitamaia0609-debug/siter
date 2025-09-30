import os
import threading
import discord
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

# =======================
# 🔹 CONFIGURAÇÕES
# =======================
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")  # configure no Render
BOT_PREFIX = "!"

intents = discord.Intents.default()
intents.message_content = True
bot = discord.Client(intents=intents)

# =======================
# 🔹 SITE (FastAPI)
# =======================
app = FastAPI()

# Servir arquivos estáticos do build do Vite (client/dist)
dist_path = os.path.join(os.path.dirname(__file__), "client", "dist")

if not os.path.exists(dist_path):
    print("⚠️ Atenção: pasta client/dist não encontrada. Rode 'npm run build' no client.")

# Rota principal → index.html
@app.get("/")
def serve_index():
    return FileResponse(os.path.join(dist_path, "index.html"))

# Rota para assets estáticos
app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")

# =======================
# 🔹 BOT DISCORD
# =======================
@bot.event
async def on_ready():
    print(f"✅ Bot logado como {bot.user}")

@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    if message.content.startswith(f"{BOT_PREFIX}ping"):
        await message.channel.send("Pong 🏓")

# =======================
# 🔹 THREAD DO BOT
# =======================
def start_bot():
    bot.run(DISCORD_TOKEN)

# =======================
# 🔹 MAIN ENTRYPOINT
# =======================
if __name__ == "__main__":
    # Inicia o bot numa thread separada
    threading.Thread(target=start_bot, daemon=True).start()

    # Render define a porta pelo env $PORT
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
