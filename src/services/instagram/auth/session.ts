import { readFileSync, writeFileSync } from "fs";
import { IgApiClient } from "instagram-private-api";
import { withRealtime, IgApiClientRealtime } from "instagram_mqtt";
import { customSession } from "../../../server";
import { redisClient } from "../../../core/redis";

const IG_USERNAME = process.env.IG_USERNAME;
const IG_PASSWORD = process.env.IG_PASSWORD;

const instagramLogin = async () => {
  const IG_SESSION_KEY = 'instagram-session.json'; // todo: armazenar a sessão em outro lugar
  const ig: IgApiClientRealtime = withRealtime(new IgApiClient()); 

  let should_login = true;
  let serialized_session;

  try {
    serialized_session = readFileSync(IG_SESSION_KEY, 'utf8')
    
  } catch (error) {
    console.warn('Error while trying to read the session', error);
  }

  if (serialized_session) {
    try {
      await ig.state.deserialize(serialized_session);
      await ig.user.info(ig.state.cookieUserId);
      const user_info = await ig.user.info(ig.state.cookieUserId);
      console.debug('Logged in as', user_info.username);
      should_login = false;
    } catch (error) {
      console.warn('Error while trying to restore the session', error);
    }  
  }
  if (should_login) {
    console.log('should login again');

    ig.request.end$.subscribe(async () => {
      const serialized = await ig.state.serialize();

      delete serialized.constants;
      writeFileSync(IG_SESSION_KEY, JSON.stringify(serialized));
    });

    ig.state.generateDevice(IG_USERNAME + '123');
    const auth = await ig.account.login(IG_USERNAME as string, IG_PASSWORD as string); 
    // obs: pode ser necessário usar proxy em produção
    // todo: checkpoint challenge https://github.com/dilame/instagram-private-api/blob/master/examples/checkpoint.example.ts
    console.debug(auth);
  }

  return {
    ig
  };
};

export default instagramLogin;