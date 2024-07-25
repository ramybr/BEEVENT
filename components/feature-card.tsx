import Image from "next/image";

interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
}

const FeatureCard = ({ title, description, imageSrc }: FeatureCardProps) => (
  <div className=" rounded-lg shadow-lg p-6 h-[300px] dark:bg-background-1st-level">
    <div className="relative h-3/5 dark:bg-gray-900">
      <Image
        src={imageSrc}
        alt={title}
        // width={300}
        // height={200}
        className="mx-auto mb-4"
        layout="fill"
        objectFit="contain"
      />
    </div>
    <h3 className="text-2xl font-semibold mb-2 pt-1">{title}</h3>
    <p className="text-gray-700 dark:text-bg1-contrast">{description}</p>
  </div>
);

export default FeatureCard;
