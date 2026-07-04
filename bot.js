const { chromium } = require('playwright');

const USERNAME = 'BT ATO-MIC';
const PASSWORD = process.env.PASSWORD;

if (!PASSWORD) {
  console.error('❌ Укажи PASSWORD в переменных окружения Render');
  process.exit(1);
}

async function main() {
  console.log('🚀 Запуск бота...');

  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  const page = await context.newPage();

  try {
    await page.goto('https://develgames.ru/', { waitUntil: 'networkidle', timeout: 60000 });
    console.log('Сайт открыт');

    // Попытка логина
    console.log('Попытка входа...');
    await page.waitForTimeout(3000);

    // Адаптивный поиск полей входа
    const loginButton = await page.locator('text=Войти, text=Login, text=Вход, button:has-text("Войти")').first();
    if (await loginButton.count() > 0) await loginButton.click();

    await page.waitForTimeout(2000);

    await page.fill('input[type="text"], input[placeholder*="ник"], input[placeholder*="логин"], input[name*="login"]', USERNAME).catch(() => {});
    await page.fill('input[type="password"]', PASSWORD).catch(() => {});

    await page.click('button[type="submit"], button:has-text("Войти"), button:has-text("Login")').catch(() => {});

    console.log('✅ Логин выполнен (или уже был)');
  } catch (e) {
    console.log('⚠️ Ошибка при входе:', e.message);
  }

  console.log('🤖 Бот работает 24/7...');

  // Бесконечный цикл
  while (true) {
    try {
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
      
      // Попытка тапалки
      await page.locator('text=ТАПАЛКА, 👆, 🐾, Лапка').click().catch(() => {});

      console.log(`[${new Date().toLocaleTimeString()}] Сессия жива`);
      await page.waitForTimeout(45000 + Math.random() * 30000); // 45-75 сек
    } catch (err) {
      console.log('Переподключение...', err.message);
      await page.waitForTimeout(10000);
    }
  }
}

main().catch(console.error);
