import { MODULE_ID, MODULE_LANG_ID, MODULE_SETTINGS } from "./constants.mjs";

/**
 * Creates the settings for the module.
 */
export function _createSettings() {
    for (const setting of Object.values(MODULE_SETTINGS)) {
        const name =
            setting.data.name ||
            `${MODULE_LANG_ID}.settings.${setting.key}.Name`;
        const hint =
            setting.data.name ||
            `${MODULE_LANG_ID}.settings.${setting.key}.Hint`;
        const data = {
            name: name,
            hint: hint,
            ...setting.data,
        };
        game.settings.register(setting.namespace, setting.key, data);
    }
}

/**
 * Changes the rendering of chat messages to support tooltips.
 * @param {Object} message
 * @param {JQuery} messageHtml
 * @param {Object} data
 */
export function _renderChatMessage(message, messageHtml, data) {
    // If setting MODIFY_CHAT_MESSAGE is false, abort.
    if (
        !game.settings.get(
            MODULE_SETTINGS.MODIFY_CHAT_MESSAGE.namespace,
            MODULE_SETTINGS.MODIFY_CHAT_MESSAGE.key
        )
    )
        return;

    const diceFormulaDiv = messageHtml.find("div.dice-formula").first();

    // If the message has no official roll formula, we skip it.
    if (!diceFormulaDiv.length) return;
    diceFormulaDiv.hide();

    const newDiceFormulaDiv = $("<div>").addClass("dice-formula");

    for (const roll of message.rolls) {
        for (const term of roll.terms) {
            let flavor =
                term.flags?.[MODULE_ID]?.flavor || term.options?.flavor;

            if (
                roll instanceof dnd5e.dice.D20Roll &&
                term.faces === 20 &&
                !flavor
            ) {
                flavor = "D20";
            }

            newDiceFormulaDiv.append(
                $("<span>").text(term.expression).attr("data-tooltip", flavor)
            );
        }
    }

    diceFormulaDiv.after(newDiceFormulaDiv);
}
