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

        public static void Clone(string folder, string remoteRepo)
        {
            Repository.Clone(remoteRepo, folder, new CloneOptions()
            {
                Checkout = true,
                IsBare = false,
            });
        }

        public static void Commit(string folder, string path, string content, string username)
        {
            using (var repo = new Repository(folder))
            {
                var paths = new List<string>();
                paths.Add(folder);
                paths.AddRange(path.Split(new string[] { "\\" }, StringSplitOptions.RemoveEmptyEntries));
                var path2 = Path.Combine(paths.ToArray());
                File.WriteAllText(path2, content);
                repo.Index.Add(path.Substring(1));
                repo.Commit($"Updated {Path.GetFileName(path2)}", 
                    new Signature(username, username, DateTimeOffset.UtcNow), 
                    new Signature(username, username, DateTimeOffset.UtcNow));

                if (repo.Network.Remotes["origin"] != null)
                {
                    repo.Network.Push(repo.Branches["master"]);
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
