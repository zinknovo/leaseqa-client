import {useRouter} from "next/navigation";
import {FaBullhorn} from "react-icons/fa";
import {Folder, Post} from "../types";
import {getFolderDisplayName} from "../utils";

type AnnouncementProps = {
    posts: Post[];
    folders: Folder[];
};

export default function AnnouncementSection({posts, folders}: AnnouncementProps) {
    const router = useRouter();

    const announcementPosts = posts
        .filter(p => p.postType === "announcement")
        .slice(0, 5);

    if (!announcementPosts.length) return null;

    const handlePostClick = (postId: string) => {
        router.push(`/qa/${postId}`);
    };

    return (
        <div className="feed-section">
            <div className="feed-section-title">
                <FaBullhorn size={16}/>
                <span>Announcements</span>
            </div>
            <div className="feed-section-posts">
                {announcementPosts.map((post) => (
                    <div
                        key={post._id}
                        className={`feed-section-post ${post.isResolved ? "resolved" : ""}`}
                        onClick={() => handlePostClick(post._id)}
                    >
                        <div className="feed-section-post-top">
                            <span className="feed-section-post-title">
                                {post.isResolved && <span className="resolved-badge">✓</span>}
                                {post.summary}
                            </span>
                            <div className="feed-section-post-tags">
                                {post.folders.map(f => (
                                    <span key={f} className="feed-section-folder-badge">
                                        {getFolderDisplayName(folders, f)}
                                    </span>
                                ))}
                                {post.urgency && (
                                    <span className={`feed-section-urgency-badge ${post.urgency}`}>
                                        {post.urgency.toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="feed-section-post-snippet">
                            {post.details.replace(/<[^>]*>/g, "").slice(0, 120)}...
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
