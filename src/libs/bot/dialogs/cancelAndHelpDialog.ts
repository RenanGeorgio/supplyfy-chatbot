import { InputHints } from 'botbuilder';
import { ComponentDialog, DialogContext, DialogTurnResult, DialogTurnStatus } from 'botbuilder-dialogs';

export class CancelAndHelpDialog extends ComponentDialog {
  constructor(id: string) {
    super(id);
  }

  // verifica se ocoreeu alguma interupção
  // é classe base de outros dialogos como: bookingDialog
  // verifica se o usuario solicitou interrupção em tais dialogos, se sim 
  // vai para um dos fluxos de interrupção em 'async interrupt', caso contrario
  // repassa a conversa para o fluxo normal de dialogos
  public async onContinueDialog(innerDc: DialogContext): Promise<DialogTurnResult> {
    const result = await this.interrupt(innerDc);
    if (result) {
      return result;
    }

    return await super.onContinueDialog(innerDc);
  }

  private async interrupt(innerDc: DialogContext): Promise<DialogTurnResult|undefined> {
    if (innerDc.context.activity.text) {
      const text = innerDc.context.activity.text.toLowerCase();

      switch (text) {
        /*
        envia uma mensagem e, em seguida, retorna um objeto 
        { status: DialogTurnStatus.waiting } para indicar que a 
         caixa de diálogo principal está aguardando uma resposta do usuário. 
         Dessa forma, o fluxo de conversa é interrompido durante somente um turno e, 
         no próximo turno, continua do ponto em que a conversa parou
        */
        case 'help':
        case '?': {
          const helpMessageText = 'Show help here';
          await innerDc.context.sendActivity(helpMessageText, helpMessageText, InputHints.ExpectingInput);
          return { status: DialogTurnStatus.waiting };
        }
        /*
        envia uma mensagem e, em seguida, retorna um objeto 
        { status: DialogTurnStatus.waiting } para indicar que a 
         caixa de diálogo principal está aguardando uma resposta do usuário. 
         Dessa forma, o fluxo de conversa é interrompido durante somente um turno e, 
         no próximo turno, continua do ponto em que a conversa parou
        */
        case 'cancel':
        case 'quit': {
          const cancelMessageText = 'Cancelling...';
          await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
          return await innerDc.cancelAllDialogs();
        }
      }
    }
  }
}