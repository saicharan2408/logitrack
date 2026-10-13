
create table public.vehicles (id text primary key, number text not null, model text not null, type text not null default 'LCV', driver text, capacity text, fuel int not null default 100, mileage text, location text, status text not null default 'Available', odometer int default 0, last_service text, next_service text, created_at timestamptz not null default now());
create table public.drivers (id text primary key, name text not null, rating numeric not null default 4.5, trips int not null default 0, success_rate int default 95, vehicle text, location text, earnings int default 0, safety int default 90, phone text, license text, status text not null default 'Online', created_at timestamptz not null default now());
create table public.shipments (id text primary key, customer text not null, pickup text not null, destination text not null, driver text, vehicle text, status text not null default 'Pending', eta text, price int not null default 0, ship_date date not null default current_date, weight text, priority text not null default 'Standard', created_at timestamptz not null default now());
create table public.warehouses (id text primary key, name text not null, city text not null, capacity_used int not null default 50, incoming int default 0, outgoing int default 0, skus int default 0, created_at timestamptz not null default now());
create table public.inventory (sku text primary key, name text not null, qty int not null default 0, weight text, location text, created_at timestamptz not null default now());
create table public.maintenance (id uuid primary key default gen_random_uuid(), vehicle text not null, model text, type text not null, due date not null, status text not null default 'Upcoming', cost int default 0, created_at timestamptz not null default now());
create table public.fuel_logs (id uuid primary key default gen_random_uuid(), vehicle text not null, litres numeric not null, cost int not null, station text, log_date date not null default current_date, created_at timestamptz not null default now());
create table public.invoices (id text primary key, customer text not null, amount int not null, status text not null default 'Unpaid', due date not null, created_at timestamptz not null default now());
create table public.notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null, type text not null default 'info', text text not null, unread boolean not null default true, created_at timestamptz not null default now());
create table public.support_tickets (id uuid primary key default gen_random_uuid(), user_id uuid not null, subject text not null, message text not null, status text not null default 'Open', created_at timestamptz not null default now());
create table public.chat_threads (id uuid primary key default gen_random_uuid(), user_id uuid not null, title text not null default 'New chat', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.chat_messages (id uuid primary key default gen_random_uuid(), thread_id uuid not null references public.chat_threads(id) on delete cascade, user_id uuid not null, sdk_id text not null, role text not null, parts jsonb not null, created_at timestamptz not null default now(), unique(thread_id, sdk_id));

do $$ declare t text; begin
foreach t in array array['vehicles','drivers','shipments','warehouses','inventory','maintenance','fuel_logs','invoices'] loop
  execute format('grant select,insert,update,delete on public.%I to authenticated; grant all on public.%I to service_role; alter table public.%I enable row level security;', t,t,t);
  execute format('create policy "team read" on public.%I for select to authenticated using (true);', t);
  execute format('create policy "team insert" on public.%I for insert to authenticated with check (true);', t);
  execute format('create policy "team update" on public.%I for update to authenticated using (true) with check (true);', t);
  execute format('create policy "team delete" on public.%I for delete to authenticated using (true);', t);
end loop;
foreach t in array array['notifications','support_tickets','chat_threads','chat_messages'] loop
  execute format('grant select,insert,update,delete on public.%I to authenticated; grant all on public.%I to service_role; alter table public.%I enable row level security;', t,t,t);
  execute format('create policy "own rows" on public.%I for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());', t);
end loop; end $$;

alter publication supabase_realtime add table public.shipments, public.vehicles, public.notifications;

create or replace function public.welcome_notifications() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications(user_id,type,text) values
  (new.id,'shipment','Shipment LT-20264003 was delivered in Chennai'),
  (new.id,'delay','Shipment LT-20264007 is delayed near Pune'),
  (new.id,'maintenance','Vehicle TS 12 EK 4521 is due for maintenance tomorrow');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.welcome_notifications();

insert into public.vehicles values
('VH-1000','TS 12 EK 4521','Tata Ace Gold','Mini Truck','Ramesh Kumar','850 kg',72,'13.2 km/l','Hyderabad','Available',42150,'2026-07-12','2026-10-14',now()),
('VH-1001','KA 05 MJ 7713','Ashok Leyland Dost+','LCV','Suresh Babu','1500 kg',45,'12.1 km/l','Bengaluru','On Trip',61200,'2026-07-03','2026-10-20',now()),
('VH-1002','MH 14 CX 3390','Mahindra Bolero Pickup','Pickup','Anil Reddy','1200 kg',23,'11.4 km/l','Pune','Maintenance',88010,'2026-06-28','2026-10-09',now()),
('VH-1003','DL 03 QP 9021','Eicher Pro 2049','Mini Truck','Vikram Singh','3500 kg',91,'9.8 km/l','Delhi','Offline',23480,'2026-07-21','2026-11-02',now()),
('VH-1004','AP 16 LN 5562','Tata 407 Gold','LCV','Arjun Nair','2500 kg',64,'10.5 km/l','Vijayawada','Available',51900,'2026-07-15','2026-10-30',now()),
('VH-1005','TN 09 AB 1187','Force Traveller','Pickup','Karthik Iyer','1000 kg',38,'12.8 km/l','Chennai','On Trip',70330,'2026-07-08','2026-10-18',now()),
('VH-1006','TS 07 EK 6640','Bharat Benz 1617','Mini Truck','Manoj Verma','3200 kg',82,'8.9 km/l','Hyderabad','Maintenance',95120,'2026-06-19','2026-10-11',now()),
('VH-1007','MH 01 MJ 2208','Mahindra Furio 7','LCV','Deepak Rao','2800 kg',57,'10.1 km/l','Mumbai','Available',33870,'2026-07-25','2026-11-05',now());
insert into public.drivers values
('DR-2000','Ramesh Kumar',4.8,812,98,'TS 12 EK 4521','Hyderabad',84000,96,'+91 98480 22134','TS21 2019482231','On Trip',now()),
('DR-2001','Suresh Babu',4.5,540,95,'KA 05 MJ 7713','Bengaluru',62000,91,'+91 99012 55871','KA44 2020119384','Online',now()),
('DR-2002','Anil Reddy',4.2,330,92,'MH 14 CX 3390','Pune',41000,86,'+91 90003 44120','MH17 2021553201','Online',now()),
('DR-2003','Vikram Singh',4.9,940,99,'DL 03 QP 9021','Delhi',96000,98,'+91 98110 77320','DL09 2018220145','Online',now()),
('DR-2004','Arjun Nair',4.0,210,91,'AP 16 LN 5562','Vijayawada',28000,82,'+91 94400 11298','AP33 2023887102','On Trip',now()),
('DR-2005','Karthik Iyer',4.6,605,97,'TN 09 AB 1187','Chennai',71000,94,'+91 98400 66510','TN12 2020334987','Offline',now()),
('DR-2006','Manoj Verma',4.3,450,93,'TS 07 EK 6640','Hyderabad',53000,88,'+91 97010 23345','TS55 2019667120','Online',now()),
('DR-2007','Deepak Rao',4.7,720,96,'MH 01 MJ 2208','Mumbai',79000,95,'+91 98200 99012','MH02 2022441873','Online',now()),
('DR-2008','Sandeep Yadav',4.4,388,94,'TS 12 EK 4521','Delhi',47000,90,'+91 93910 44781','DL27 2024102938','On Trip',now());
insert into public.shipments (id,customer,pickup,destination,driver,vehicle,status,eta,price,ship_date,weight,priority) values
('LT-20264000','Sri Sai Traders','Hyderabad','Chennai','Ramesh Kumar','TS 12 EK 4521','In Transit','4h 20m',18500,'2026-10-12','640 kg','Express'),
('LT-20264001','Deccan Textiles','Bengaluru','Mumbai','Suresh Babu','KA 05 MJ 7713','In Transit','7h 05m',32400,'2026-10-12','1200 kg','Standard'),
('LT-20264002','Godrej Logistics Pvt Ltd','Pune','Hyderabad','Anil Reddy','MH 14 CX 3390','Pending','—',12800,'2026-10-13','310 kg','Standard'),
('LT-20264003','TVS Distribution','Vijayawada','Chennai','Arjun Nair','AP 16 LN 5562','Delivered','Delivered',9600,'2026-10-10','420 kg','Standard'),
('LT-20264004','Reliance Retail Hub','Delhi','Mumbai','Vikram Singh','DL 03 QP 9021','Delivered','Delivered',41200,'2026-10-08','1750 kg','Express'),
('LT-20264005','BigBasket Warehouse','Chennai','Bengaluru','Karthik Iyer','TN 09 AB 1187','In Transit','3h 10m',8700,'2026-10-13','280 kg','Express'),
('LT-20264006','Amaravati Foods','Visakhapatnam','Hyderabad','Manoj Verma','TS 07 EK 6640','Cancelled','—',15300,'2026-10-09','900 kg','Standard'),
('LT-20264007','Konark Electronics','Mumbai','Pune','Deepak Rao','MH 01 MJ 2208','Delayed','2h 45m',5400,'2026-10-12','150 kg','Express'),
('LT-20264008','Nilgiri Dairy','Bengaluru','Chennai','Suresh Babu','KA 05 MJ 7713','Delivered','Delivered',7200,'2026-10-07','520 kg','Standard'),
('LT-20264009','Vishal Mega Mart','Hyderabad','Vijayawada','Ramesh Kumar','TS 12 EK 4521','Pending','—',6900,'2026-10-14','350 kg','Standard'),
('LT-20264010','Sri Sai Traders','Delhi','Hyderabad','Vikram Singh','DL 03 QP 9021','In Transit','8h 40m',38900,'2026-10-12','1600 kg','Standard'),
('LT-20264011','Deccan Textiles','Chennai','Visakhapatnam','Karthik Iyer','TN 09 AB 1187','Delayed','5h 15m',14100,'2026-10-11','760 kg','Standard');
insert into public.warehouses values
('WH-300','Hyderabad Central Hub','Hyderabad',82,24,19,1240,now()),('WH-301','Bengaluru North Yard','Bengaluru',67,15,22,860,now()),
('WH-302','Chennai Port Depot','Chennai',91,38,12,1480,now()),('WH-303','Mumbai Bhiwandi Hub','Mumbai',58,11,30,640,now());
insert into public.inventory values
('SKU-8000','Corrugated Boxes',3400,'2 kg','Hyderabad Central Hub',now()),('SKU-8001','Steel Fasteners',5,'12 kg','Mumbai Bhiwandi Hub',now()),
('SKU-8002','Cotton Bales',820,'60 kg','Chennai Port Depot',now()),('SKU-8003','Rice Sacks (25kg)',1900,'25 kg','Hyderabad Central Hub',now()),
('SKU-8004','Electronics Carton',260,'8 kg','Bengaluru North Yard',now()),('SKU-8005','Ceramic Tiles',3900,'30 kg','Chennai Port Depot',now()),
('SKU-8006','Plastic Crates',7,'3 kg','Bengaluru North Yard',now()),('SKU-8007','Auto Spare Parts',540,'15 kg','Mumbai Bhiwandi Hub',now()),
('SKU-8008','Textile Rolls',1100,'20 kg','Hyderabad Central Hub',now()),('SKU-8009','Packaged Snacks',2300,'5 kg','Chennai Port Depot',now());
insert into public.maintenance (vehicle,model,type,due,status,cost) values
('TS 12 EK 4521','Tata Ace Gold','Oil Change','2026-10-14','Upcoming',2400),('KA 05 MJ 7713','Ashok Leyland Dost+','Brake Service','2026-10-05','Overdue',6800),
('MH 14 CX 3390','Mahindra Bolero Pickup','Engine Tune-up','2026-10-09','Overdue',14500),('DL 03 QP 9021','Eicher Pro 2049','Tyre Rotation','2026-09-28','Completed',3200),
('AP 16 LN 5562','Tata 407 Gold','General Inspection','2026-10-22','Upcoming',1800),('TS 07 EK 6640','Bharat Benz 1617','AC Service','2026-10-02','Completed',5600);
insert into public.fuel_logs (vehicle,litres,cost,station,log_date) values
('TS 12 EK 4521',38,3990,'HPCL Kukatpally','2026-10-12'),('KA 05 MJ 7713',55,5720,'IOCL Hebbal','2026-10-11'),('DL 03 QP 9021',120,12360,'BPCL Dwarka','2026-10-10'),('TN 09 AB 1187',42,4410,'IOCL Guindy','2026-10-12');
insert into public.invoices values
('INV-5001','Reliance Retail Hub',41200,'Paid','2026-10-15',now()),('INV-5002','Deccan Textiles',32400,'Unpaid','2026-10-20',now()),
('INV-5003','TVS Distribution',9600,'Paid','2026-10-12',now()),('INV-5004','Konark Electronics',5400,'Overdue','2026-10-05',now()),('INV-5005','Sri Sai Traders',57400,'Unpaid','2026-10-25',now());
