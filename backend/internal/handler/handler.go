package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"wdb/internal/repository"
	"wdb/models"
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

func (h *Handler) CreateUser(c *gin.Context) {
	var user models.User

	err := c.BindJSON(&user)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	createdUser, err := h.repo.CreateUser(user, c)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}
	c.IndentedJSON(http.StatusCreated, createdUser)
}

func (h *Handler) GetUsers(c *gin.Context) {
	// return h.repo.GetUsers()
}
