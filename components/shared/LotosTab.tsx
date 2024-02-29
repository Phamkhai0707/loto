import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import LotoCard from "../cards/LotoCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const LotosTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result = await fetchUserPosts(accountId);
  if (!result) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.lotos.map((loto: any) => (
        <LotoCard
          key={loto._id}
          id={loto._id}
          currentUserId={currentUserId}
          parentId={loto.parentId}
          content={loto.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: loto.author.name,
                  image: loto.author.image,
                  id: loto.author.id,
                }
          }
          community={loto.community}
          createdAt={loto.createdAt}
          comments={loto.children}
        />
      ))}
    </section>
  );
};

export default LotosTab;
