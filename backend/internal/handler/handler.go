package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"wdb/internal/repository"
)

type Handler struct {
	repo *repository.Repository
}

func NewHandler(repo *repository.Repository) *Handler {
	return &Handler{
		repo: repo,
	}
}

func (h *Handler) HelloWorld(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Hello, World!",
	})
}
