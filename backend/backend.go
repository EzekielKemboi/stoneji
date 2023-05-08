package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/syndtr/goleveldb/leveldb"
)

var db *leveldb.DB

func main() {
	// 打开数据库
	db, err := leveldb.OpenFile("./leveldb", nil)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// 启动 HTTP 服务
	router := gin.Default()

	// 添加 CORS 中间件
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "https://www.youtube.com")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	router.GET("/get", getKey)
	router.GET("/set", setKey)
	router.Run(":8080")
}

func getKey(c *gin.Context) {
	c.String(200, "%s", `{"value":"i love stone"}`)
	// key := c.PostForm("key")
	// value, err := db.Get([]byte(key), nil)
	// if err != nil {
	// 	c.String(404, "Key not found")
	// } else {
	// 	c.String(200, "%s", value)
	// }
}

func setKey(c *gin.Context) {
	key := c.PostForm("key")
	value := c.PostForm("value")
	err := db.Put([]byte(key), []byte(value), nil)
	if err != nil {
		c.String(500, "Internal server error")
	} else {
		c.String(200, "OK")
	}
}
