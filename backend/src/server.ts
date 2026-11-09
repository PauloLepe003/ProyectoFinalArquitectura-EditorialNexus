import 'dotenv/config';
import {app} from './app.js';
import {db} from './config/db.js';
await db.$connect();
const server=app.listen(Number(process.env.PORT??3000),()=>console.log('Editorial Nexus: http://localhost:'+(process.env.PORT??3000)));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>{void db.$disconnect().then(()=>process.exit(0));}));
