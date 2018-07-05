using LibGit2Sharp;
using System;
using System.Collections.Generic;
using System.IO;

namespace KB.Helpers
{
    public static class GitHelpers
    {

        public static void Init(string folder)
        {
            Repository.Init(folder);
        }

        public static bool IsInitialized(string folder)
        {
            return Repository.IsValid(folder);
        }

        public static void Clone(string folder, string remoteRepo, string username, string password)
        {
            CloneOptions co = new CloneOptions()
            {
                Checkout = true,
                IsBare = false,
            };

            if (username != null && password != null)
            {
                Credentials ca = new UsernamePasswordCredentials() { Username = username, Password = password };
                co.CredentialsProvider = (_url, _user, _cred) => ca;
            }

            Repository.Clone(remoteRepo, folder,co);
        }

        public static void Commit(string folder, string path, string content, string username, string name, string password)
        {
            using (var repo = new Repository(folder))
            {
                var paths = new List<string>();
                paths.Add(folder);
                paths.AddRange(path.Split(new string[] { "\\" }, StringSplitOptions.RemoveEmptyEntries));
                var path2 = Path.Combine(paths.ToArray());
                Directory.CreateDirectory(Path.GetDirectoryName(path2));
                File.WriteAllText(path2, content);
                repo.Index.Add(path.Substring(1));
                repo.Commit($"Updated {Path.GetFileName(path2)}", 
                    new Signature(username, username, DateTimeOffset.UtcNow), 
                    new Signature(username, username, DateTimeOffset.UtcNow));

                if (repo.Network.Remotes["origin"] != null)
                {
                    PushOptions co = new PushOptions()
                    {
                        
                    };

                    if (name != null && password != null)
                    {
                        Credentials ca = new UsernamePasswordCredentials() { Username = name, Password = password };
                        co.CredentialsProvider = (_url, _user, _cred) => ca;
                    }

                    repo.Network.Push(repo.Network.Remotes["origin"], "refs/heads/master:refs/heads/master",co);
                }
            }
        }

        public static void AddRemote(string folder, string remoteRepo)
        {
            using (var repo = new Repository(folder))
            {
                repo.Network.Remotes.Update("origin", x => { x.Url = remoteRepo; });
            }
        }

        public static void Push(string folder)
        {
            using (var repo = new Repository(folder))
            {
                repo.Network.Push(repo.Branches["master"]);
            }
        }
    }
}
