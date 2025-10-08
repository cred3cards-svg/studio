import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Logo() {
  const logoImage = PlaceHolderImages.find(img => img.id === 'logo');

  return (
    <Link href="/" className="items-center space-x-2 flex">
      {logoImage && (
        <Image
          src={logoImage.imageUrl}
          alt={logoImage.description}
          width={32}
          height={32}
          className="rounded-full"
          data-ai-hint={logoImage.imageHint}
        />
      )}
      <span className="font-bold font-headline">INRTX Reserve</span>
    </Link>
  );
}
