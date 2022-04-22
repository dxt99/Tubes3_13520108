CREATE SCHEMA IF NOT EXISTS public;

COMMENT ON SCHEMA public
    IS 'standard public schema';

GRANT ALL ON SCHEMA public TO PUBLIC;

GRANT ALL ON SCHEMA public TO postgres;

DROP TABLE IF EXISTS public.hasil;

DROP TABLE IF EXISTS public.penyakit;

CREATE TABLE IF NOT EXISTS public.penyakit
(
    "IDPenyakit" SERIAL NOT NULL,
    "NamaPenyakit" character varying COLLATE pg_catalog."default" NOT NULL,
    "DNA" character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT penyakit_pkey PRIMARY KEY ("IDPenyakit")
);

CREATE TABLE IF NOT EXISTS public.hasil
(
    "IDHasil" SERIAL NOT NULL,
    "Pengguna" character varying COLLATE pg_catalog."default" NOT NULL,
    "IDPenyakit" integer NOT NULL,
    "Similarity" real NOT NULL,
    CONSTRAINT hasil_pkey PRIMARY KEY ("IDHasil"),
    CONSTRAINT "HasilIDPenyakit" FOREIGN KEY ("IDPenyakit")
        REFERENCES public.penyakit ("IDPenyakit") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

