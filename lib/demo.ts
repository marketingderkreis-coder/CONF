export type TaskStatus='Backlog'|'Ingepland'|'Bezig'|'Wacht op input'|'Wacht op controle'|'Goedgekeurd'|'Gepubliceerd'|'Afgerond';
export const people=['Pieter de Vries','Sanne Jansen','Mila Bakker','Joris Visser','Lotte Smit'];
export const items=[
 {id:'aeg',title:'AEG cashbackactie oktober',type:'Campagne',summary:'Cashbackcampagne voor Keukenspecialisten.nl en DER KREIS NL. Live op vrijdag.',status:'Actief',priority:'Hoog',date:'2026-09-18',profiles:['Keukenspecialisten.nl','DER KREIS Nederland'],progress:71},
 {id:'adee',title:'Nieuwe deelnemer Adee Keukens',type:'Nieuwe deelnemer',summary:'Nieuwe showroom volledig online en aangesloten maken.',status:'Ingepland',priority:'Normaal',date:'2026-09-21',profiles:['Keukenspecialisten.nl'],progress:38},
 {id:'nieuwsbrief',title:'Maandelijkse nieuwsbrief oktober',type:'Nieuwsbrief',summary:'B2B nieuwsbrief met leveranciersnieuws en aankomende events.',status:'Te bespreken',priority:'Normaal',date:'2026-10-01',profiles:['DER KREIS Nederland'],progress:20},
 {id:'meeting',title:'Keukenspecialisten meeting',type:'Evenement',summary:'Voorbereiding en communicatie van de landelijke najaarsmeeting.',status:'Actief',priority:'Hoog',date:'2026-09-25',profiles:['Keukenspecialisten.nl'],progress:54},
 {id:'showroom',title:'Opening nieuwe showroom',type:'Nieuwe showroom',summary:'Openingscommunicatie via social, website en POS.',status:'Nieuw',priority:'Urgent',date:'2026-09-16',profiles:['Enviroo Keukens'],progress:12},
];
export const tasks=[
 {id:'1',title:'Landingspagina bouwen',item:'AEG cashbackactie oktober',owner:'Sanne Jansen',channel:'Website',status:'Bezig' as TaskStatus,date:'2026-09-14',load:'Middel',hours:0},
 {id:'2',title:'Social visual ontwerpen',item:'AEG cashbackactie oktober',owner:'Joris Visser',channel:'DTP',status:'Afgerond' as TaskStatus,date:'2026-09-13',load:'Middel',hours:2.5},
 {id:'3',title:'Social post schrijven',item:'AEG cashbackactie oktober',owner:'Mila Bakker',channel:'Instagram',status:'Wacht op controle' as TaskStatus,date:'2026-09-15',load:'Klein',hours:1},
 {id:'4',title:'Showroompagina aanmaken',item:'Nieuwe deelnemer Adee Keukens',owner:'Sanne Jansen',channel:'Website',status:'Ingepland' as TaskStatus,date:'2026-09-16',load:'Groot',hours:0},
 {id:'5',title:'Nieuwsbriefitem maken',item:'Maandelijkse nieuwsbrief oktober',owner:'Lotte Smit',channel:'B2B nieuwsbrief',status:'Backlog' as TaskStatus,date:'',load:'Middel',hours:0},
 {id:'6',title:'Programma en uitnodiging finaliseren',item:'Keukenspecialisten meeting',owner:'Pieter de Vries',channel:'Evenement',status:'Wacht op input' as TaskStatus,date:'2026-09-12',load:'Groot',hours:0},
];
export const statusStyle:Record<string,string>={'Actief':'bg-blue-50 text-blue-700','Ingepland':'bg-violet-50 text-violet-700','Te bespreken':'bg-amber-50 text-amber-700','Nieuw':'bg-slate-100 text-slate-700','Bezig':'bg-blue-50 text-blue-700','Afgerond':'bg-emerald-50 text-emerald-700','Wacht op controle':'bg-amber-50 text-amber-700','Wacht op input':'bg-orange-50 text-orange-700','Backlog':'bg-slate-100 text-slate-600','Goedgekeurd':'bg-emerald-50 text-emerald-700','Gepubliceerd':'bg-teal-50 text-teal-700'};
