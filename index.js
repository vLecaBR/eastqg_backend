import app from './src/app.js';
import { PORT } from './src/config/config.js';
import { startKeepAlive } from './src/utils/scheduler.js';
import { logInfo } from './src/utils/logger.js';

const port = process.env.PORT || PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  logInfo(`Server running at http://localhost:${port}`);
});

// inicia keep-alive pro Render
startKeepAlive();
