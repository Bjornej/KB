using LibGit2Sharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace KB.Helpers
{
    public static class GitHelpers
    {

        public static void Init(string folder)
        {
            Repository.Init(folder);
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
                File.WriteAllText(Path.Combine(folder, path), content);
                repo.Index.Add(path);
                repo.Commit($"Updated {Path.GetFileName(path)}", 
                    new Signature(username, username, DateTimeOffset.UtcNow), 
                    new Signature(username, username, DateTimeOffset.UtcNow));
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
