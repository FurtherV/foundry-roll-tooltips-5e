// This file is automatically executed by FoundryVTT

import { MODULE_NAME } from "./scripts/constants.mjs";
import { _createSettings, _renderChatMessage } from "./scripts/hooks.mjs";

Hooks.once("init", () => {
    console.log(`FurtherV | Initializing ${MODULE_NAME}`);
});

Hooks.once("setup", _createSettings);

Hooks.on("renderChatMessage", _renderChatMessage);
