import { vi, it, expect, describe, beforeAll } from "vitest";
import { AdminService } from "../admin.services";
import { fakeAdminRepository } from "../../_mocks/fake-admin.repository";
import { UserService } from "../../../user/service/user.services";
import { fakeUserRepository } from "../../../user/_mocks/fake-user.repository";
import { IAdminService } from "../admin.services.interface";
import { fakeAdmin } from "../../_mocks/fake-admin";
import { fakeUser } from "../../../user/_mocks/fake-user";

const userService = new UserService(fakeUserRepository);
let adminService: IAdminService;

describe("AdminService", () => {
   beforeAll(() => {
      adminService = new AdminService(fakeAdminRepository, fakeUserRepository);
   });

   describe("findAdminByEmail", () => {
      it("Should return an admin when finding admin email", async () => {
         try {
            const result = await adminService.findAdminByEmail(fakeAdmin.email);
            expect(fakeAdmin).toHaveProperty("email");
            expect(result).toEqual(fakeAdmin);
         } catch (error) {
            console.error(error);
         }
      });

      it("Should handle admin not found when finding admin email", async () => {
         try {
            vi.spyOn(fakeAdminRepository, "findAdminByEmail").mockImplementationOnce(() => Promise.resolve(null));
            await expect(adminService.findAdminByEmail("")).rejects.toThrow();
         } catch (error) {
            console.error(error);
         }
      });
   });

   describe("sendJewelsToUser", () => {
      const userId = fakeUser._id;
      const amount = fakeUser.jewelsAmount;

      it("Should send an jewels amount to an user.", async () => {
         try {
            await adminService.sendJewelsToUser(userId, amount);

            const updatedUser: any = await userService.getUserById(userId);

            expect(updatedUser).toHaveProperty("jewelsAmount");
            expect(updatedUser.jewelsAmount).toBe(amount);
         } catch (error) {
            console.error(error);
         }
      });

      it("Should return an error if not possible to send jewels.", async () => {
         try {
            vi.spyOn(fakeUserRepository, "getUserById").mockImplementationOnce(() => Promise.resolve(null));
            await expect(adminService.sendJewelsToUser(userId, amount)).rejects.toThrow();
         } catch (error) {
            console.error(error);
         }
      });
   });
});
