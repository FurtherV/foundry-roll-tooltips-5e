export const MODULE_ID = "roll-tooltips-5e";
export const MODULE_NAME = "Roll Tooltips 5e";
export const MODULE_LANG_ID = MODULE_ID.toUpperCase();
export const MODULE_SETTINGS = {
    MODIFY_CHAT_MESSAGE: {
        namespace: MODULE_ID,
        key: "modify-chat-message",
        data: {
            default: true,
            type: Boolean,
            scope: "client",
            config: true,
            requiresReload: true,
        },
    },
};
