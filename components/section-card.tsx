import Image from "next/image";
import Link from "next/link";

interface SectionCardProps {
  title: string;
  description: string;
  imageSrc: string;
  link: string;
}

const SectionCard = ({
  title,
  description,
  imageSrc,
  link,
}: SectionCardProps) => (
  <Link href={link}>
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow md:hover:scale-110 md:transition-transform duration-300 ease-in-out h-[300px] flex flex-col justify-between dark:bg-background-2nd-level/95">
      <div className="relative h-3/5">
        <Image src={imageSrc} alt={title} layout="fill" objectFit="contain" />
      </div>
      <div className="flex flex-col justify-center h-2/5">
        <h3 className="text-2xl font-semibold mb-2 text-center">{title}</h3>
        <p className="text-gray-700 text-center overflow-hidden dark:text-bg1-contrast/50">
          {description}
        </p>
      </div>
    </div>
  </Link>
);

export default SectionCard;
