class RollTooltips5e {
    static MODULE_ID = "roll-tooltips-5e";
    static MODULE_TITLE = "Roll Tooltips DnD5e";
    static LOCALIZATION_ID = this.MODULE_ID.toUpperCase();

    static SETTINGS = {
        MODIFY_CHAT_MESSAGE: {
            key: "modify-chat-message",
            default: true,
            type: Boolean,
            scope: "client",
            config: true,
        },
    };

    static log(...args) {
        console.log(this.MODULE_ID, "|", ...args);
    }

    static _registerSettings() {
        for (const value of Object.values(this.SETTINGS)) {
            game.settings.register(
                this.MODULE_ID,
                value.key,
                foundry.utils.mergeObject(
                    value,
                    {
                        name: `${this.LOCALIZATION_ID}.settings.${value.key}.Name`,
                        hint: `${this.LOCALIZATION_ID}.settings.${value.key}.Hint`,
                    },
                    {
                        insertKeys: true,
                        insertValues: true,
                        overwrite: false,
                    }
                )
            );
        }
    }

    /**
     * Renders chat messages with dice rolls and adds tooltips to the dice formula.
     *
     * @param {ChatMessage} message - The chat message to render.
     * @param {Array} html - An array of HTML elements representing the chat message.
     * @param {Object} options - An object containing rendering options.
     */
    static _onRenderChatMessage(message, [html], options) {
        if (
            !game.settings.get(
                this.MODULE_ID,
                this.SETTINGS.MODIFY_CHAT_MESSAGE.key
            )
        ) {
            return;
        }

        // Get the dice configuration object
        const diceConfig = CONFIG.Dice;

        // If the message is not a roll, exit the function
        if (!message.isRoll) return;

        // Get the first roll in the message
        const [roll] = message.rolls;

        // If the roll is not a D20 roll or a damage roll, exit the function
        if (
            !(
                roll instanceof diceConfig.D20Roll ||
                roll instanceof diceConfig.DamageRoll
            )
        )
            return;

        // Find the div element containing the dice formula
        const diceFormulaDiv = $(html).find(".dice-formula");

        // If the div element is not found, exit the function
        if (diceFormulaDiv.length === 0) return;

        // Clear the text content of the div element
        diceFormulaDiv.empty();

        // Iterate over each term in the roll
        for (const term of roll.terms) {
            // Get the text and tooltip for the term
            const text = term.expression;
            const tooltip = term.flavor;

            // Create a new span element with the text content
            const span = $("<span>")
                .text(text)
                // If the tooltip is not empty, set the data-tooltip attribute
                .attr("data-tooltip", tooltip ? tooltip : undefined);

            // Append the new span element to the dice formula div
            span.appendTo(diceFormulaDiv);
        }
    }

    /**
     * Modifies roll configuration by replacing shorthand notation for ability modifiers and proficiency bonuses.
     *
     * @param {Item} item - The item being rolled.
     * @param {Object} rollConfig - The configuration object for the roll.
     */
    static _onPreRollAttack(item, rollConfig) {
        // Replace shorthand notation for ability modifiers and proficiency bonuses
        rollConfig.parts = rollConfig.parts.map((x) => {
            x = x.replace("@mod", "@mod[Mod]");
            x = x.replace("@prof", "@prof[Prof]");
            return x;
        });
    }

    static init() {
        this.log(`Initializing ${this.MODULE_TITLE}`);
        this._registerSettings();

        Hooks.on("renderChatMessage", this._onRenderChatMessage.bind(this));
        Hooks.on("dnd5e.preRollAttack", this._onPreRollAttack.bind(this));
    }
}

Hooks.once("init", RollTooltips5e.init.bind(RollTooltips5e));
