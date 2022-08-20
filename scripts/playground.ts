const qrcode = require('qrcode-terminal');
import { Client, LocalAuth, Chat, Message, Contact, MessageMedia } from 'whatsapp-web.js'
import { MongoDB } from '../src/db/mongo/mongo_db';

const RELEASE_NOTE = `היי, בהתרגשות רבה שמחים לבשר שהכל מוכן ומהיום אפשר לעשות גסטה מהשקם ולבקש משלוחים ביחידה😁🥳

אז איך הכל עובד:
להזמנת משלוח, פשוט שולחים מ או משלוח, עוקבים אחרי הצעדים ומחכים שמישהו יעשה ג׳סטה😌

כאשר המשלוח יגיע תקבלו תמונה מדויקת של איפה הוא נמצא ואת פרטי הקשר של הג׳סטר שלכם כדי להעביר לו את הסכום של ההזמנה שלכם בדרך שנוח לשניכם👨🏼‍🤝‍👨🏽

בשביל לעשות ג׳סטה 🛵:
• שולחים ש, שקם או אני בשקם
• בוחרים משלוח שרוצים לעשות ושמים את הקבלה בשקית✅
• מביאים אותו לעמדת המשלוחים המתאימה ביחידה (לובי מצוב או חמל טופז, לפי המיקום שלכם)📦
•מצלמים תמונה של המשלוח בעמדה📸
• ישלחו אליכם פרטי הקשר של המזמין כדי שתוכלו להסדיר ביניכם את התשלום💸

הזמנות ומשלוחים נעימים💛`

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    // var mongoDb = new MongoDB();
    // await mongoDb.init();
    // console.log(`MongoDB initialized with ${await mongoDb.userCount()} users`);

    console.log("Shekemishlohim Bot!");
    const client = new Client({
        authStrategy: new LocalAuth()
    });

    client.on('qr', (qr: any) => {
        console.log("QR code: " + qr);
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', async () => {
        client.getChats().then(async (chats: Chat[]) => {
            for (let chat of chats) {
                chat.sendMessage(RELEASE_NOTE);
                await delay(1000);            
            }
        });
    });

    client.on('message', (message: Message) => { });

    client.initialize();
}

main()