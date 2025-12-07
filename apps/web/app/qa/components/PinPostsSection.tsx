import {useRouter} from "next/navigation";
import {FaMapPin} from "react-icons/fa";
import {Folder, Post} from "../types";
import {getFolderDisplayName} from "../utils";

type PinPostsProps = {
    posts: Post[];
    folders: Folder[];
};

export default function PinPostsSection({posts, folders}: PinPostsProps) {
    const router = useRouter();

    const pinPosts = posts
        .filter(p => p.isPinned)
        .slice(0, 5);

    if (!pinPosts.length) return null;

    const handlePostClick = (postId: string) => {
        router.push(`/qa/${postId}`);
    };

    return (
        <div className="feed-section">
            <div className="feed-section-title">
                <FaMapPin size={16}/>
                <span>Pin</span>
            </div>
            <div className="feed-section-posts">
                {pinPosts.map((post) => (
                    <div
                        key={post._id}
                        className="feed-section-post"
                        onClick={() => handlePostClick(post._id)}
                    >
                        <div className="feed-section-post-top">
                            <span className="feed-section-post-title">{post.summary}</span>
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
