import { app } from "./src/app";
require('dotenv').config();

async function bootstrap() {
  await app.start();  
}
bootstrap();
