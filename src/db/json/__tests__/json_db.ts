import { User } from '../../../models/user';
import { JsonDB, RecordNotFound } from '../json_db';

let db: JsonDB = new JsonDB('./db_tests.json');

beforeAll(async () => {
    await db.init();
})

describe('sanity db checks', () => {
  it('should return record not found on non existing user', async () => {
    await db.getUser("123").then(user => "", (err) => {
        expect(err).toEqual(new RecordNotFound);
    });
  })

  var korenUser = new User("2711", "Koren", 3, "2000");
  it('should create a new user successfully', async () => {
    await db.updateUser(korenUser).then(user => expect(user).toEqual(korenUser));
    await db.recordCount().then(count => expect(count).toEqual(1));
  })

  it('should return the user we just added', async () => {
    await db.getUser("2711").then(user => expect(user).toEqual(korenUser));
  })

  it('should update the user we just added', async () => {
    korenUser.token_count++;
    await db.updateUser(korenUser).then(user => expect(user).toEqual(korenUser));
    await db.recordCount().then(count => expect(count).toEqual(1));
  })
})
