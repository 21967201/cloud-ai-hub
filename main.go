package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
)

type TaskState struct {
	TaskID  string                 `json:"task_id"`
	Status  string                 `json:"status"`
	Context map[string]interface{} `json:"context"`
}

type Skill struct {
	Name        string `json:"name"`
	CreatedAt   string `json:"created_at"`
	TriggeredAt string `json:"triggered_at"`
}

var stateStore map[string]*TaskState
var stateMutex = make(map[string]bool)
var skillHub []Skill

func init() {
	stateStore = make(map[string]*TaskState)
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Cloud AI Hub is running!")
}

func handleStateUpdate(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	taskID := vars["id"]

	if stateMutex[taskID] {
		w.WriteHeader(http.StatusConflict)
		w.Write([]byte("State is currently being updated"))
		return
	}
	stateMutex[taskID] = true
	defer delete(stateMutex, taskID)

	var newStatus string
	json.NewDecoder(r.Body).Decode(&newStatus)
	if newStatus == "" {
		newStatus = "updated"
	}

	stateStore[taskID] = &TaskState{
		TaskID: taskID,
		Context: map[string]interface{}{
			"updated_at": time.Now().UTC().Format(time.RFC3339),
		},
		Status: newStatus,
	}
	w.Write([]byte(fmt.Sprintf("State updated for task %s", taskID)))
}

func handleEvolution(w http.ResponseWriter, r *http.Request) {
	skill := Skill{
		Name:        fmt.Sprintf("auto_gen_skill_%d", time.Now().Unix()),
		CreatedAt:   time.Now().UTC().Format(time.RFC3339),
		TriggeredAt: time.Now().UTC().Format(time.RFC3339),
	}
	skillHub = append(skillHub, skill)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"skill":   skill,
	})
}

func handleSkillList(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(skillHub)
}

func handleDashboard(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	html := `<!DOCTYPE html>
<html>
<head><title>Cloud AI Hub</title>
<style>body{background:#1a1a1a;color:#00ff9d;font-family:monospace;padding:20px;}
.card{background:#000;border:1px solid #333;padding:20px;margin:20px 0;}
button{background:#00ff9d;color:#000;border:none;padding:10px 20px;cursor:pointer;margin:5px;}</style>
</head>
<body>
<h1>🤖 Cloud AI Hub Dashboard</h1>
<div class="card"><h3>State Status</h3><div id="state">Empty</div><button onclick="updateState()">Update State</button></div>
<div class="card"><h3>Evolution Logs</h3><div id="logs"></div><button onclick="evolve()">Trigger Evolution</button></div>
<div class="card"><h3>Deployed Skills</h3><div id="skills"></div></div>
<script>
async function updateState(){await fetch('/api/v1/state/test-001/update',{method:'POST',body:'"updated"'});location.reload();}
async function evolve(){const r=await fetch('/api/v1/skills/evolve',{method:'POST'});const d=await r.json();document.getElementById('logs').innerText=JSON.stringify(d,null,2);refreshSkills();}
async function refreshSkills(){const r=await fetch('/api/v1/skills');document.getElementById('skills').innerText=JSON.stringify(await r.json(),null,2);}
refreshSkills();
</script></body></html>`
	w.Write([]byte(html))
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", handleDashboard)
	r.HandleFunc("/health", handleHealth)
	r.HandleFunc("/api/v1/state/{id}/update", handleStateUpdate)
	r.HandleFunc("/api/v1/skills/evolve", handleEvolution)
	r.HandleFunc("/api/v1/skills", handleSkillList)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("🚀 Cloud AI Hub is running on :%s", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), r))
}