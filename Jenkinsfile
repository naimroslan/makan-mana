pipeline {
  agent any
  tools { nodejs "node" }
  stages {
    stage("Install Dependencies"){
      steps {
        // Install pnpm globally
        sh 'npm install -g pnpm'

        // Use pnpm to install deps
        sh 'pnpm install'
      }
    }
    stage("Building Image"){
      steps{
        script {
          dockerImage = docker.build imageName
        }
      }
    }
    stage("Deploy Image"){
      steps{
        script {
          docker.withRegistry("https://registry.hub.docker.com", 'dockerhub-creds'){
           dockerImage.push("${env.BUILD_NUMBER}") 
          }
        }
      }
    }
  }
}