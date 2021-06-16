import { app } from "./src/app";

async function bootstrap() {
  await app.start();  
}
bootstrap();
