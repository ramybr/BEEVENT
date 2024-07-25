import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DataCardProps = {
  value: string;
  label: string;
  shouldFormat?: boolean;
};

export const DataCard = ({ value, label }: DataCardProps) => {
  return (
    <Card className="dark:bg-background-2nd-level dark:text-bg2-contrast">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
