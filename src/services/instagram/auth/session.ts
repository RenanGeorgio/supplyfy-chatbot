// Comentado por Thomás para rodar primeira versão sem instagram-private-api
import { readFileSync, writeFileSync } from "fs";
//import { IgApiClient } from "instagram-private-api";
import { withRealtime, IgApiClientRealtime } from "instagram_mqtt";
import { Events } from "../../../types/enums";

const ERROR_MESSAGES = {
  CHALLENGE_REQUIRED: "É necessário resolver um desafio para continuar",
  SESSION_ERROR: "Erro ao tentar restaurar a sessão",
  LOGIN_ERROR: "Erro ao tentar fazer login",
  SESSION_RESTORED: "Sessão restaurada com sucesso!",
  SESSION_SAVED: "Sessão salva com sucesso!",
};

// todo: tratar o erro "RequestError: Error: connect ETIMEDOUT 157.240.222.63:443", causando crash no servidor
const instagramLogin = async ({ username, password }) => {
  const IG_SESSION_KEY = `${username}_session.json`;
  // @ts-ignore
  const ig: IgApiClientRealtime = withRealtime({});

  let should_login = true;
  let serialized_session: string | null = null;
  let status = {} as any;

  // const deserializeSession = async () => {
  //   await ig.state.deserialize(serialized_session);
  //   const userInfo = await ig.user.info(ig.state.cookieUserId);
  //   console.debug("Logged in as", userInfo.username);
  // };

  try {
    serialized_session = readFileSync(IG_SESSION_KEY, "utf8"); // substituir por redis ou mongo
  } catch (error) {
    console.warn("Error while trying to read the session", error);
  }

  if (serialized_session) {
    try {
      // await deserializeSession();
      should_login = false;
    } catch (error: any) {
      const errorString = error.toString();
      if (errorString.includes("challenge_required")) {
        // ig.destroy();
        return {
          success: false,
          message: ERROR_MESSAGES.CHALLENGE_REQUIRED,
          event: Events.SERVICE_ERROR,
          service: "instagram",
        };
      } else if (error?.cause?.code === "ETIMEDOUT" || errorString.includes("ETIMEDOUT")) {
        console.log("dentro do timeout", error)
        // ig.destroy();
        const restoreSession = setTimeout(async () => {
          // await deserializeSession();
          should_login = false;
          console.log(ERROR_MESSAGES.SESSION_RESTORED);
        }, 5000);
        clearTimeout(restoreSession);
        return;
      } else {
        console.log("dentro do else");
        // should_login = true;
      }
    }
  }
  
  if (should_login) {
    console.log("should login again");

    // ig.request.end$.subscribe(async () => {
    //   const serialized = await ig.state.serialize();

    //   delete serialized.constants;
    //   writeFileSync(IG_SESSION_KEY, JSON.stringify(serialized)); // substituir por redis ou mongo
    // });

    // ig.state.generateDevice(username + "123");

    try {
      // await ig.simulate.preLoginFlow();
      // const auth = await ig.account.login(username, password);
      // process.nextTick(async () => await ig.simulate.postLoginFlow());
    } catch (error) {
      console.error("Erro ao tentar fazer login", error);
    }
    // obs: pode ser necessário usar proxy em produção
    // todo: checkpoint challenge https://github.com/dilame/instagram-private-api/blob/master/examples/checkpoint.example.ts
  }

  return {
    ig,
  };
};

export default instagramLogin;