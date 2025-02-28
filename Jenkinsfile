pipeline {
  agent any
  tools { nodejs "node" }
  stages {
    stage("Install PNPM"){
      steps {
        sh 'npm install -g pnpm'
      }
    }

    stage("Install Dependencies"){
      steps {
        sh 'pnpm install'
      }
    }

  }
}