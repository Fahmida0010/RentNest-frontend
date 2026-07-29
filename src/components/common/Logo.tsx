import Link from "next/link";
import { Home } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">
        <Home className="h-6 w-6" />
      </div>
      <span className="tracking-tight text-red-950">
        Rent<span className="text-green-600 font-bold">Nest</span>
      </span>
    </Link>
  );
}