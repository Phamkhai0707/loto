import LotoCard from "@/components/cards/LotoCard";
import Comment from "@/components/forms/Comment";
import { fetchLotoById } from "@/lib/actions/loto.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const loto = await fetchLotoById(params.id);

  return (
    <section className="relative">
      <div>
        <LotoCard
          key={loto._id}
          id={loto._id}
          currentUserId={user?.id || ""}
          parentId={loto.parentId}
          content={loto.text}
          author={loto.author}
          community={loto.community}
          createdAt={loto.createdAt}
          comments={loto.children}
        />
      </div>

      <div className="mt-7">
        <Comment
          lotoId={loto.id}
          currentUserImg={user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
    </section>
  );
};

export default Page;
