import Image from "next/image";

interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
}

const FeatureCard = ({ title, description, imageSrc }: FeatureCardProps) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <Image
      src={imageSrc}
      alt={title}
      width={300}
      height={200}
      className="mx-auto mb-4"
    />
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

export default FeatureCard;
