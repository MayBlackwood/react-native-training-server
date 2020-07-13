FROM postgres
ENV POSTGRES_PASSWORD postgres 
ENV POSTGRES_DB nativeapp 
ADD init.sql /docker-entrypoint-initdb.d/