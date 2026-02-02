import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users, type User, type NewUser } from "../../db/schema";

interface ProfilePictureUpdate {
  profilePictureUrl: string | null;
  profilePicturePublicId: string | null;
}

export const userRepository = {
  async findById(id: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  },

  async findByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return user;
  },

  async update(id: string, data: Partial<NewUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  },

  async updateProfilePicture(
    id: string,
    data: ProfilePictureUpdate,
  ): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        profilePictureUrl: data.profilePictureUrl,
        profilePicturePublicId: data.profilePicturePublicId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  },

  async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  },
};
