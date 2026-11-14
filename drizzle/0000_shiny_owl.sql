CREATE TABLE "profiles" (
	"guest_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"city" text NOT NULL,
	"address" text NOT NULL,
	"postal_code" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"guest_id" uuid NOT NULL,
	"product_id" varchar(100) NOT NULL,
	"quantity" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cart_items_guest_id_product_id_pk" PRIMARY KEY("guest_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"category" varchar(40) NOT NULL,
	"title" varchar(200) NOT NULL,
	"price" integer NOT NULL,
	"image" text NOT NULL,
	"description" text NOT NULL,
	"stock" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"guest_id" uuid NOT NULL,
	"product_id" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "favorites_guest_id_product_id_pk" PRIMARY KEY("guest_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"email" varchar(254) PRIMARY KEY NOT NULL,
	"subscribed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"guest_id" uuid NOT NULL,
	"idempotency_key" varchar(100) NOT NULL,
	"status" varchar(30) NOT NULL,
	"subtotal" integer NOT NULL,
	"total" integer NOT NULL,
	"currency" varchar(3) NOT NULL,
	"customer" jsonb NOT NULL,
	"items" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "orders_guest_idempotency_key" ON "orders" USING btree ("guest_id","idempotency_key");