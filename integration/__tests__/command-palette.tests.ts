import { Application } from "spectron";
import * as utils from "../helpers/utils";
import { isMac } from "../../src/common/vars";

jest.setTimeout(60000);

describe("Lens command palette", () => {
  let app: Application;

  describe("menu", () => {
    beforeAll(async () => {
      app = await utils.appStart();
      await utils.clickWhatsNew(app);
    }, 20000);

    afterAll(async () => {
      if (app?.isRunning()) {
        await utils.tearDown(app);
      }
    });

    it("opens command dialog from menu", async () => {
      await app.electron.ipcRenderer.send("test-menu-item-click", "View", "Command Palette...");
      await app.client.waitUntilTextExists(".Select__option", "Preferences: Open");
      await app.client.keys("Escape");
    });

    utils.describeIf(!isMac)("Linux & Windows", () => {
      it("opens command dialog via keyboard", async () => {
        await app.client.keys(["Control", "Shift", "p"]);
        await app.client.waitUntilTextExists(".Select__option", "Preferences: Open");
        await app.client.keys("Escape");
      });
    });
  });
});
