#!/bin/bash

psql -U postgres -h localhost -c "create database connect_the_schools;"
psql -U postgres -h localhost -c "create user admin with encrypted password 'admin';"
psql -U postgres -h localhost -c "grant all privileges on database connect_the_schools to admin;"
psql -U postgres -h localhost -d connect_the_schools -c "grant create on schema public to admin;"
psql -U postgres -h localhost -d connect_the_schools -c "grant usage on schema public to admin;"
