import { Case } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

type FeaturedCasesType = {
    cases: Case[]
}

const FeaturedCases = (props: FeaturedCasesType) => {
    const cases = props.cases! as Case[];
    return (
        <div className="flex flex-col sm:flex-row gap-5 truncate flex-wrap">
            {cases.map((caseObject) => (
                <Link
                    href={`/case/${caseObject.id}`}
                    passHref
                    key={caseObject.id}
                >
                    <div className="group flex cursor-pointer flex-col items-center rounded-lg border-2 border-transparent bg-zinc-800 px-4 py-2 font-medium hover:border-red-500">
                        <Image
                            src={caseObject.imageURL}
                            alt="Case logo"
                            width={150}
                            height={150}
                            className="transition-all group-hover:scale-110"
                            placeholder="blur"
                            blurDataURL={caseObject.imageURL}
                        />
                        <h1 className="text-md">{caseObject.name}</h1>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default FeaturedCases