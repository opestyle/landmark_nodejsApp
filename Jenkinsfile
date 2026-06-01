pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh '''
                    npm install -g pnpm
                    pnpm install
                    pnpm build
                '''
            }
        }

        stage('Test') {
            steps {
                sh 'pnpm test'
            }
        }

        stage('Docker Build') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker build -t landmark-devops:latest .'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
