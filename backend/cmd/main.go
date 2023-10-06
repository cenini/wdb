package main

import (
	"database/sql"

	v1 "wdb/api/v1"
	"wdb/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

func init() {
	// Set the desired log level. Options are: Trace, Debug, Info, Warn, Error, Fatal, Panic
	logrus.SetLevel(logrus.DebugLevel)

	// Set the desired log formatter. Options are: JSONFormatter, TextFormatter
	logrus.SetFormatter(&logrus.JSONFormatter{})
}

func initDB() (*bun.DB, *sql.DB) {
	dsn := "postgres://psql:password@localhost:5432/psql?sslmode=disable"
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))

	db := bun.NewDB(sqldb, pgdialect.New(), bun.WithDiscardUnknownColumns())
	err := db.Ping()
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"error": err,
		}).Error("Failed to ping the database.")
	}

	return db, sqldb
}

func main() {
	// Establish a database connection
	db, sqldb := initDB()
	defer db.Close()
	defer sqldb.Close()

	// Create a repository with the database connection
	repo := repository.NewRepository(db)

	// Set up Gin router
	r := gin.Default()
	v1.SetupRoutes(r.Group("/api"), repo)

	// Start the server
	r.Run(":8080")
}
