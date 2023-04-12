import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";

const isAdmin = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    if (!session) {
        return false;
    }

    const isAdminRes = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            isAdmin: true,
        },
    });

    if (!isAdminRes || !isAdminRes.isAdmin) {
        return false
    }

    return true;
}

export default isAdmin;