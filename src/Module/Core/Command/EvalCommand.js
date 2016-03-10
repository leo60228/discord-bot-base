const AbstractCommand = require('../../../AbstractCommand');

class EvalCommand extends AbstractCommand {
    static get name() { return 'eval'; }

    static get description() { return "Evaluates the given code"; }

    static get adminCommand() { return true; }

    handle() {
        this.responds(/^eval(?:\s+)```[a-z]*\n([\s\S]*)?\n```/, (matches) => {
            this.evalCode(matches[1]);
        });
        this.responds(/^eval(?:\s+)`?([\s\S]*)?`?/, (matches) => {
            this.evalCode(matches[1]);
        });
    }

    evalCode(code) {
        if (this.client.admin.id !== this.message.author.id) {
            return false;
        }

        let message;
        this.reply("Executing code.")
            .then(m => message = m);

        setTimeout(() => {
            let response;
            try {
                response = eval(code);
            } catch (error) {
                response = error.message;
            }

            if (Array.isArray(response) || typeof response === 'object') {
                response = JSON.stringify(response);
            }

            this.client.updateMessage(message, "```\n" + response + "\n```");
        }, 500);
    }
}

module.exports = EvalCommand;