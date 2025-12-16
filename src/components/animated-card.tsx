import Typewriter from 'typewriter-effect';
import { TypographyP } from '@/components/ui/typography';
import { Card, CardContent } from '@/components/ui/card';

interface AnimatedCardProps {
  className?: string;
  text: string[];
}

export function AnimatedCard({ className, text }: AnimatedCardProps) {
  return (
    <Card className={`w-full ${className}`}>
      <CardContent className='p-4'>
        <TypographyP className='text-sm font-extralight tracking-wider hyphens-auto'>
          <Typewriter
            options={{
              strings: text,
              autoStart: true,
              loop: true,
              delay: 50,
              deleteSpeed: 25,
            }}
          />
        </TypographyP>
      </CardContent>
    </Card>
  );
}
