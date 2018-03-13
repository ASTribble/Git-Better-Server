
 [
    {
        "question": "What command would temporarily jump you back to commit 789abcd?",
        "answer": "git checkout 789abcd"
    },

    {
        "question": "What command would roll you back to a previous commit 789abcd while keeping the changes?",
        "answer": "git reset --soft 789abcd"
    },

    {
        "question": "What command will roll back the last commit?",
        "answer": "git reset --soft HEAD~"
    },

    {
        "question": "What command would you type if you want to permanently discard changes made after commit 789abcd?",
        "answer": "git reset --hard 789abcd"
    },

    {
        "question": "What command would you type if you want to discard changes made after the last commit?",
        "answer": "git reset --hard HEAD~"
    },
    {
        "question": "How do you copy the commit 946992 from one branch to another?",
        "answer":"git cherry-pick 946992"
    },
    {
        "question":"How do you squash previous 5 commits without rebasing?",
        "answer":"git reset --soft HEAD~5"
    },
    {
        "question":"How do you clean untracked files interactively?",
        "answer":"git clean -i"
    },
    {
        "question":"How do you find out who changed the file index.js?",
        "answer":"git blame index.js"
    },
    {
        "question":"How do you unstage the file server.js that contains changes?",
        "answer":"git reset server.js"
    }
  ]
