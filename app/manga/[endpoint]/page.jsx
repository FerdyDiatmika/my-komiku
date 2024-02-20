import WatchListButton from "@/components/KomikList/WatchlistButton";
import { getComicResponse } from "@/libs/api-libs";
import { authUserSession } from "@/libs/auth-libs";
import prisma from "@/libs/prisma";
import { CaretRight, CheckCircle, Star } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

const Page = async ({ params: { endpoint } }) => {
  const detailKomik = await getComicResponse(`info/manga/${endpoint}`);
  const user = await authUserSession();
  const watchlist = await prisma.watchlist.findFirst({
    where: { user_email: user?.email, endpoint: endpoint },
  });
  return (
    <div className="flex flex-col min-h-screen ">
      <div className="px-4 py-6 md:px-6 md:py-12 lg:py-16 flex-grow bg-light-background dark:bg-dark-background">
        <div className="grid md:grid-cols-2 md:gap-6 lg:gap-12 max-w-6xl mx-auto items-start space-y-4 md:space-y-0 ">
          <div className="relative w-full h-100 md:h-auto ">
            <Image
              alt="Cover image"
              className="object-cover object-center rounded-lg "
              src={detailKomik.data.thumbnail}
              priority="primary"
              width={500}
              height={500}
            />
          </div>
          <div className="space-y-4 text-light-dark dark:text-dark-text">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {detailKomik.data.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {detailKomik.data.author}
              </p>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" weight="fill" />
                  {detailKomik.data.status}
                </p>
                <p className="flex items-center gap-2">
                  <Star className="w-4 h-4" weight="fill" />
                  {detailKomik.data.rating}
                </p>
                {!watchlist && user && (
                  <WatchListButton
                    user_email={user?.email}
                    endpoint={endpoint}
                    comic_image={detailKomik.data.thumbnail}
                    comic_titles={detailKomik.data.title}
                  />
                )}
              </div>
              <div>
                <p>Genres</p>
                <ul className="flex flex-col items-start gap-2">
                  {detailKomik.data.genre.map((genre, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CaretRight className="w-4 h-4" weight="fill" />
                      {genre}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid gap-4">
              <h2 className="text-2xl font-bold tracking-tight">Chapters</h2>
              <ul className="grid gap-2">
                {detailKomik.data.chapter_list.map((chapter_list, index) => {
                  return (
                    <li key={index}>
                      <Link className="underline" href={chapter_list.endpoint}>
                        {chapter_list.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
