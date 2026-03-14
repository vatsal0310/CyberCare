import { Phone } from "lucide-react"

export default function VishingTab(){

return(
<div className="bg-card border border-white/10 rounded-xl p-8 space-y-6">

<div className="flex items-center gap-4">

<div className="bg-cyan-500/20 p-3 rounded-lg">
<Phone size={22}/>
</div>

<div>
<h2 className="text-xl font-semibold">
Voice Phishing (Vishing)
</h2>

<p className="text-muted text-sm">
Phone call scams and social engineering
</p>
</div>

</div>

</div>

)
}