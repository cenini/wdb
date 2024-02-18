#!/bin/bash
cd wdb-fe
npm run web &
cd ../wdb-be
npm run start &
cd ..
